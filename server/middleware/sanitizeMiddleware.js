const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  return value;
};

const sanitizeRequest = (req, res, next) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
};

module.exports = sanitizeRequest;
