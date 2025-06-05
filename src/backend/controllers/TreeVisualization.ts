import { Response } from "miragejs";

export const getTreeVisualData = async () => {
  try {
    const response = await fetch("/data/treevisual.json");
    const json = await response.json();
    return {
      Status: true,
      Result: json,
    };
  } catch (err) {
    console.error(err);

    return new Response(
      500,
      {},
      {
        Status: false,
        Error: "Failed to load graph visualization data",
      }
    );
  }
};
