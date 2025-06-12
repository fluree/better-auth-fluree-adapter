/* eslint-disable @typescript-eslint/no-explicit-any */
import FlureeClient from "@fluree/fluree-client";

export interface FlureeAdapterConfig {
  url: string;
  ledger: string;
  apiKey?: string;
  privateKey?: string;
  debugLogs?: boolean;
}

// Helper to convert better-auth where clause to Fluree query
function buildFlureeWhere(model: string, where: any): Record<string, unknown> {
  const whereClause: Record<string, unknown> = {};

  if (Array.isArray(where)) {
    // Handle Where[] array format
    where.forEach((condition: any) => {
      if (condition.field === "id") {
        whereClause["@id"] = `${model}:${condition.value}`;
      } else {
        whereClause[`${model}:${condition.field}`] = condition.value;
      }
    });
  } else {
    // Handle simple object format
    Object.entries(where).forEach(([key, value]) => {
      if (key === "id") {
        whereClause["@id"] = `${model}:${value}`;
      } else {
        whereClause[`${model}:${key}`] = value;
      }
    });
  }

  return whereClause;
}

// Helper to convert Fluree response to better-auth format
function flureeToModel(
  data: Record<string, unknown> | null,
  model: string,
): any {
  if (!data) return null;

  const result: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === "@id") {
      // Extract ID from @id format (e.g., "user:123" -> "123")
      const id = String(value).split(":").pop();
      result.id = id;
    } else if (key.startsWith(`${model}:`)) {
      // Remove model prefix from property names
      const propName = key.replace(`${model}:`, "");
      result[propName] = value;
    } else if (key === "@type") {
      // Skip @type, we don't need it in the result
      return;
    } else if (!key.startsWith("@")) {
      result[key] = value;
    }
  });

  return result;
}

export const flureeAdapter = (config: FlureeAdapterConfig) => {
  console.log("Creating Fluree adapter with config:", {
    url: config.url,
    ledger: config.ledger,
    debugLogs: config.debugLogs,
  });

  // Create the Fluree client once
  const url = new URL(config.url);
  const client = new FlureeClient({
    host: url.hostname,
    port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
    ledger: config.ledger,
  });

  return () => {
    const adapter = {
      id: "fluree",
      name: "fluree",

      async create({ model, data }: any): Promise<any> {
        console.log(`🔥 CREATE called for model: ${model}`);
        console.log(`🔥 CREATE data:`, JSON.stringify(data, null, 2));
        
        try {

          // Generate a unique ID if not provided
          const id = data.id || crypto.randomUUID();

          // Build the transaction data
          const txData = {
            "@context": {
              [model]: `https://schema.better-auth.com/${model}/`,
            },
            "@id": `${model}:${id}`,
            "@type": model,
            ...Object.entries(data).reduce(
              (acc, [key, value]) => {
                if (key !== "id") {
                  acc[`${model}:${key}`] = value;
                }
                return acc;
              },
              {} as Record<string, unknown>,
            ),
          };

          if (config.debugLogs) {
            console.log(
              "Fluree CREATE transaction:",
              JSON.stringify(txData, null, 2),
            );
          }

          // Execute the transaction
          const transactionPayload = {
            ledger: config.ledger,
            "@context": {
              [model]: `https://schema.better-auth.com/${model}/`,
            },
            insert: {
              "@id": `${model}:${id}`,
              "@type": model,
              ...Object.entries(data).reduce(
                (acc, [key, value]) => {
                  if (key !== "id") {
                    acc[`${model}:${key}`] = value;
                  }
                  return acc;
                },
                {} as Record<string, unknown>,
              ),
            },
          };
          
          console.log("About to transact:", JSON.stringify(transactionPayload, null, 2));
          const txInstance = await client.transact(transactionPayload);
          console.log("Transaction instance created:", txInstance);
          
          // Send the transaction to actually persist it
          const sendResult = await txInstance.send();
          console.log("Send result:", sendResult);

          // Return the created data
          return { ...data, id };
        } catch (error) {
          console.error("Fluree CREATE error for model:", model);
          console.error("Error details:", error);
          console.error("Data attempted:", JSON.stringify(data, null, 2));
          throw error;
        }
      },

      async findOne({ model, where }: any): Promise<any> {
        try {
          const whereClause = buildFlureeWhere(model, where);
          
          if (config.debugLogs) {
            console.log("Original where:", JSON.stringify(where, null, 2));
            console.log("Built whereClause:", JSON.stringify(whereClause, null, 2));
          }

          // Use a simpler query format that should work reliably
          const query = {
            "@context": {
              [model]: `https://schema.better-auth.com/${model}/`,
            },
            from: config.ledger,
            where: {
              "@type": model,
              ...whereClause,
              "@id": "?s"
            },
            select: { "?s": ["*"] },
          };

          if (config.debugLogs) {
            console.log(
              "Fluree FIND_ONE query:",
              JSON.stringify(query, null, 2),
            );
          }

          const queryInstance = await client.query(query as any);
          const result = await queryInstance.send();

          if (config.debugLogs) {
            console.log("Fluree FIND_ONE raw result:", JSON.stringify(result, null, 2));
          }

          if (!result || !Array.isArray(result) || result.length === 0) {
            console.log("No results found or empty array");
            return null;
          }

          const converted = flureeToModel(result[0] as Record<string, unknown>, model);
          if (config.debugLogs) {
            console.log("Fluree FIND_ONE raw data to convert:", JSON.stringify(result[0], null, 2));
            console.log("Fluree FIND_ONE converted result:", JSON.stringify(converted, null, 2));
          }
          
          
          return converted;
        } catch (error) {
          console.error("Fluree FIND_ONE error:", error);
          return null;
        }
      },

      async findMany({
        model,
        where,
        limit,
        offset,
        sortBy,
      }: any): Promise<any[]> {
        try {

          const whereClause = where
            ? buildFlureeWhere(model, where)
            : { "@type": model };

          const query: any = {
            "@context": {
              [model]: `https://schema.better-auth.com/${model}/`,
            },
            from: config.ledger,
            where: {
              ...whereClause,
              "@id": "?s",
            },
            select: { "?s": ["*"] },
          };

          // Add limit and offset if provided
          if (limit !== undefined) {
            query.limit = limit;
          }
          if (offset !== undefined) {
            query.offset = offset;
          }

          // Add sorting if provided
          if (sortBy) {
            const { field, direction } = sortBy;
            query.orderBy = [
              [`${model}:${field}`, direction === "desc" ? "DESC" : "ASC"],
            ];
          }

          if (config.debugLogs) {
            console.log(
              "Fluree FIND_MANY query:",
              JSON.stringify(query, null, 2),
            );
          }

          const queryInstance = await client.query(query);
          const result = await queryInstance.send();

          if (!Array.isArray(result)) {
            return [];
          }

          return result
            .map((item: Record<string, unknown>) => flureeToModel(item, model))
            .filter(Boolean);
        } catch (error) {
          console.error("Fluree FIND_MANY error:", error);
          return [];
        }
      },

      async update({ model, where, update }: any): Promise<any> {
        try {

          // First find the record to update
          const existing = await adapter.findOne({ model, where, select: [] });
          if (!existing) {
            throw new Error(`Record not found for update`);
          }

          // Build the upsert data
          const upsertData = {
            "@id": `${model}:${existing.id}`,
            "@type": model,
            ...Object.entries(update).reduce(
              (acc, [key, value]) => {
                acc[`${model}:${key}`] = value;
                return acc;
              },
              {} as Record<string, unknown>,
            ),
          };

          if (config.debugLogs) {
            console.log(
              "Fluree UPDATE upsert:",
              JSON.stringify(upsertData, null, 2),
            );
          }

          const upsertInstance = await client.upsert([upsertData]);
          await upsertInstance.send();

          // Return the updated record
          return { ...existing, ...update };
        } catch (error) {
          console.error("Fluree UPDATE error:", error);
          throw error;
        }
      },

      async updateMany({ model, where, update }: any): Promise<number> {
        try {

          // Find all records to update
          const records = await adapter.findMany({ model, where });

          if (records.length === 0) {
            return 0;
          }

          // Build batch upsert data
          const upsertData = records.map((record: any) => ({
            "@id": `${model}:${record.id}`,
            "@type": model,
            ...Object.entries(update).reduce(
              (acc, [key, value]) => {
                acc[`${model}:${key}`] = value;
                return acc;
              },
              {} as Record<string, unknown>,
            ),
          }));

          if (config.debugLogs) {
            console.log(
              "Fluree UPDATE_MANY upsert:",
              JSON.stringify(upsertData, null, 2),
            );
          }

          // Perform batch upsert
          const upsertInstance = await client.upsert(upsertData);
          await upsertInstance.send();

          return records.length;
        } catch (error) {
          console.error("Fluree UPDATE_MANY error:", error);
          return 0;
        }
      },

      async delete({ model, where }: any): Promise<void> {
        console.log(`🗑️ DELETE called for model: ${model}`);
        console.log(`🗑️ DELETE where:`, JSON.stringify(where, null, 2));
        
        try {
          // Find the record to delete
          const existing = await adapter.findOne({ model, where, select: [] });
          console.log(`🗑️ Found existing record:`, JSON.stringify(existing, null, 2));
          
          if (!existing) {
            console.log("🗑️ No existing record found to delete");
            return;
          }

          if (config.debugLogs) {
            console.log("Fluree DELETE subject:", `${model}:${existing.id}`);
          }

          const deleteInstance = await client.delete([`${model}:${existing.id}`]);
          const deleteResult = await deleteInstance.send();
          console.log("🗑️ Delete result:", deleteResult);
        } catch (error) {
          console.error("Fluree DELETE error:", error);
          throw error;
        }
      },

      async deleteMany({ model, where }: any): Promise<number> {
        try {

          // Find all records to delete
          const records = await adapter.findMany({ model, where });

          if (records.length === 0) {
            return 0;
          }

          // Build batch delete - collect all subject IDs
          const subjectIds = records.map((record: any) => `${model}:${record.id}`);

          if (config.debugLogs) {
            console.log("Fluree DELETE_MANY subjects:", subjectIds);
          }

          const deleteInstance = await client.delete(subjectIds);
          await deleteInstance.send();

          return records.length;
        } catch (error) {
          console.error("Fluree DELETE_MANY error:", error);
          return 0;
        }
      },
    };

    return adapter;
  };
};

