import { useState, useRef, useCallback, useEffect } from "react";

interface CrackSimulatorProps {
  password: string;
  method: "bruteforce" | "dictionary";
  onComplete: () => void;
}

const COMMON_PASSWORDS = [
  "123456", "password", "12345678", "qwerty", "abc123",
  "monkey", "master", "dragon", "111111", "baseball",
  "iloveyou", "trustno1", "sunshine", "princess", "welcome",
  "shadow", "superman", "michael", "football", "admin",
];

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

const CrackSimulator = ({ password, method, onComplete }: CrackSimulatorProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(true);
  const [found, setFound] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const attemptRef = useRef(0);

  const addLine = useCallback((line: string) => {
    setLines((prev) => [...prev.slice(-80), line]);
  }, []);

  useEffect(() => {
    if (!running) return;

    const startTime = Date.now();
    let dictIndex = 0;

    intervalRef.current = setInterval(() => {
      attemptRef.current++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (method === "dictionary") {
        if (dictIndex < COMMON_PASSWORDS.length) {
          const attempt = COMMON_PASSWORDS[dictIndex];
          const match = attempt === password;
          addLine(
            `[${elapsed}s] #${attemptRef.current} Trying: "${attempt}" ${match ? "✓ MATCH!" : "✗"}`
          );
          if (match) {
            setFound(true);
            setRunning(false);
            addLine(`\n[SUCCESS] Password found: "${password}"`);
            addLine(`[INFO] Method: Dictionary Attack | Attempts: ${attemptRef.current}`);
            onComplete();
            clearInterval(intervalRef.current);
            return;
          }
          dictIndex++;
        }

        if (dictIndex >= COMMON_PASSWORDS.length) {
          addLine(`\n[FAILED] Password not in dictionary. Try brute force.`);
          setRunning(false);
          onComplete();
          clearInterval(intervalRef.current);
        }
      } else {
        // Brute force — generate random attempts, eventually "find" it
        const len = Math.min(password.length, Math.floor(Math.random() * password.length) + 1);
        let attempt = "";
        for (let i = 0; i < password.length; i++) {
          if (attemptRef.current > 50 + i * 20 && i < len) {
            attempt += password[i];
          } else {
            attempt += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        const match = attempt === password;
        addLine(
          `[${elapsed}s] #${attemptRef.current} ${attempt} ${match ? "✓ MATCH!" : ""}`
        );

        if (match || attemptRef.current > 100 + password.length * 30) {
          // Force find after enough attempts
          addLine(`\n[SUCCESS] Password cracked: "${password}"`);
          addLine(`[INFO] Method: Brute Force | Attempts: ${attemptRef.current}`);
          addLine(`[INFO] Time elapsed: ${elapsed}s`);
          setFound(true);
          setRunning(false);
          onComplete();
          clearInterval(intervalRef.current);
        }
      }
    }, 40);

    return () => clearInterval(intervalRef.current);
  }, [running, method, password, addLine, onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${running ? "bg-terminal-glow animate-pulse-glow" : found ? "bg-terminal-cyan" : "bg-terminal-red"}`} />
        {running ? "RUNNING..." : found ? "CRACKED" : "STOPPED"}
        <span className="ml-auto">Attempts: {attemptRef.current}</span>
      </div>
      <div
        ref={containerRef}
        className="bg-background border border-border border-glow rounded-sm p-3 h-64 overflow-y-auto text-xs leading-relaxed scanline"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${
              line.includes("SUCCESS") ? "text-terminal-cyan text-glow-cyan font-bold" :
              line.includes("FAILED") ? "text-terminal-red" :
              line.includes("MATCH") ? "text-terminal-glow text-glow" :
              line.includes("[INFO]") ? "text-terminal-amber" :
              "text-terminal-dim"
            }`}
          >
            {line}
          </div>
        ))}
        {running && <span className="inline-block w-2 h-4 bg-foreground animate-blink" />}
      </div>
    </div>
  );
};

export default CrackSimulator;
