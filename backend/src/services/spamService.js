const suspiciousPatterns = [/free money/i, /crypto giveaway/i, /(.)\1{9,}/, /http[s]?:\/\/\S+/i];

export const evaluateMessageSpam = ({ text = '' }) => {
  const score = suspiciousPatterns.reduce((acc, pattern) => (pattern.test(text) ? acc + 1 : acc), 0);
  return {
    isSpam: score >= 2,
    score
  };
};
