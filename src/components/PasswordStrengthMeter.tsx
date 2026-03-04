interface PasswordStrengthMeterProps {
  password: string;
}

const getStrength = (password: string) => {
  if (!password) return { score: 0, label: "N/A", time: "—" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const times = ["< 1 second", "~2 minutes", "~3 hours", "~2 years", "~centuries"];
  const idx = Math.min(score, 4);
  return { score: idx + 1, label: labels[idx], time: times[idx] };
};

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const { score, label, time } = getStrength(password);
  const colors = [
    "bg-muted",
    "bg-terminal-red",
    "bg-terminal-red",
    "bg-terminal-amber",
    "bg-terminal-glow",
    "bg-terminal-cyan",
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-sm transition-all duration-300 ${
              i <= score ? colors[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          Strength: <span className="text-foreground">{label}</span>
        </span>
        <span className="text-muted-foreground">
          Est. crack time: <span className="text-terminal-amber">{time}</span>
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
