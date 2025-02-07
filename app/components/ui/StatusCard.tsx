export function StatusCard({ label, value }: { label: string; value: string }) {
    return (
      <div className="bg-navy-800/50 rounded-lg p-4 border border-cyber-primary/20
                      hover:border-cyber-primary/40 transition-all duration-300">
        <div className="space-y-2">
          <p className="text-xs text-cyber-primary/60 font-sans">{label}</p>
          <p className="text-sm font-sans text-cyber-primary font-bold">{value}</p>
        </div>
      </div>
    );
  }