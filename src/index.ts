import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { MCPSpaceAPI } from "./services/mcpSpaceAPI.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the API client
const apiClient = new MCPSpaceAPI();

/**
 * Initialize the MCP server
 */
const server = new McpServer(
  {
    name: "mcp-space-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Tool: create-post
 * Creates a new post
 */
server.tool(
  "create-post",
  "Create a new post with the provided content",
  {
    content: z
      .string()
      .min(1)
      .max(280)
      .describe("Content of the post (1-280 characters)"),
  },
  async ({ content }) => {
    try {
      const post = await apiClient.createPost({ content });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(post, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating post:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating post: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Tool: reply-to-post
 * Creates a reply to an existing post
 */
server.tool(
  "reply-to-post",
  "Create a reply to an existing post",
  {
    content: z
      .string()
      .min(1)
      .max(280)
      .describe("Content of the reply (1-280 characters)"),
    parentId: z.string().describe("ID of the post being replied to"),
  },
  async ({ content, parentId }) => {
    try {
      const reply = await apiClient.replyToPost({ content, parentId });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(reply, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating reply:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating reply: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Tool: toggle-like
 * Likes or unlikes a post
 */
server.tool(
  "toggle-like",
  "Like or unlike a post",
  {
    postId: z.string().describe("ID of the post to like/unlike"),
  },
  async ({ postId }) => {
    try {
      const response = await apiClient.toggleLike({ postId });
      return {
        content: [
          {
            type: "text",
            text: `Post ${response.liked ? "liked" : "unliked"} successfully`,
          },
        ],
      };
    } catch (error) {
      console.error("Error toggling like:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error toggling like: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

/**
 * Tool: get-feed
 * Gets the user's feed
 */
server.tool(
  "get-feed",
  "Get recent posts feed (50 most recent posts in reverse chronological order)",
  {},
  async () => {
    try {
      const feed = await apiClient.getFeed();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(feed, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching feed:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error fetching feed: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Space MCP Server running on stdio");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main();
