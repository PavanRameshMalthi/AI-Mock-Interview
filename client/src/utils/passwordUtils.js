export const getPasswordChecks = (password) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

export const getPasswordStrength = (password) => {
  const passed = Object.values(getPasswordChecks(password)).filter(Boolean).length;

  if (!password) return { label: "Weak", score: 0 };
  if (passed <= 2) return { label: "Weak", score: 25 };
  if (passed === 3) return { label: "Medium", score: 50 };
  if (passed === 4) return { label: "Strong", score: 75 };
  return { label: "Very Strong", score: 100 };
};
