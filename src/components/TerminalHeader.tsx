const TerminalHeader = () => (
  <div className="flex items-center gap-2 border-b border-border px-4 py-2">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-terminal-red opacity-80" />
      <div className="w-3 h-3 rounded-full bg-terminal-amber opacity-80" />
      <div className="w-3 h-3 rounded-full bg-terminal-glow opacity-80" />
    </div>
    <span className="text-muted-foreground text-xs ml-2">root@cracker:~#</span>
  </div>
);

export default TerminalHeader;
