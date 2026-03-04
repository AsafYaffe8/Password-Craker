import { useState, useCallback } from "react";
import { Lock, Unlock, Shield, Zap, BookOpen } from "lucide-react";
import TerminalHeader from "@/components/TerminalHeader";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import CrackSimulator from "@/components/CrackSimulator";

const Index = () => {
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState<"bruteforce" | "dictionary">("bruteforce");
  const [cracking, setCracking] = useState(false);
  const [cracked, setCracked] = useState(false);

  const handleStart = () => {
    if (!password.trim()) return;
    setCracking(true);
    setCracked(false);
  };

  const handleReset = () => {
    setCracking(false);
    setCracked(false);
  };

  const handleComplete = useCallback(() => {
    setCracked(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 scanline">
      <div className="w-full max-w-2xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow tracking-wider">
            PASSWORD CRACKER
          </h1>
          <p className="text-muted-foreground text-sm">
            Educational password strength simulator
          </p>
        </div>

        {/* Main Terminal */}
        <div className="bg-card border border-border border-glow rounded-md overflow-hidden">
          <TerminalHeader />

          <div className="p-5 space-y-5">
            {/* Password Input */}
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground flex items-center gap-2">
                <Lock className="w-3 h-3" />
                TARGET PASSWORD
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => { setPassword(e.target.value); handleReset(); }}
                placeholder="Enter password to crack..."
                disabled={cracking && !cracked}
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:border-glow transition-all disabled:opacity-50"
              />
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Method Selection */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">ATTACK METHOD</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMethod("bruteforce"); handleReset(); }}
                  disabled={cracking && !cracked}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm text-xs border transition-all ${
                    method === "bruteforce"
                      ? "border-primary bg-primary/10 text-foreground text-glow"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  } disabled:opacity-50`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Brute Force
                </button>
                <button
                  onClick={() => { setMethod("dictionary"); handleReset(); }}
                  disabled={cracking && !cracked}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm text-xs border transition-all ${
                    method === "dictionary"
                      ? "border-primary bg-primary/10 text-foreground text-glow"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  } disabled:opacity-50`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Dictionary
                </button>
              </div>
            </div>

            {/* Action Button */}
            {!cracking ? (
              <button
                onClick={handleStart}
                disabled={!password.trim()}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-sm text-sm font-bold font-display tracking-wider hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                INITIATE CRACK
              </button>
            ) : cracked ? (
              <button
                onClick={handleReset}
                className="w-full border border-terminal-cyan text-terminal-cyan py-2.5 rounded-sm text-sm font-bold font-display tracking-wider hover:bg-terminal-cyan/10 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                RESET
              </button>
            ) : null}

            {/* Crack Output */}
            {cracking && (
              <CrackSimulator
                password={password}
                method={method}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          ⚠ For educational purposes only. Never use for unauthorized access.
        </p>
      </div>
    </div>
  );
};

export default Index;
