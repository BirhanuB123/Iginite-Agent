export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: any;
  handler: (ctx: any, input: any) => Promise<any>;
  requiresApproval?: boolean;
  approvalRole?: string;
};

export class ToolRegistryService {
  private readonly tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  get(name: string): ToolDefinition {
    const t = this.tools.get(name);
    if (!t) throw new Error(`Tool not found: ${name}`);
    return t;
  }
}
