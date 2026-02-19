// utils/calculateScore.js
export const calculateScores = (answers) => {

  let domainScores = {};
  let totalScore = 0;

  answers.forEach(a => {

    const domain = a.question_id.domain_id._id;

    if(!domainScores[domain])
      domainScores[domain] = 0;

    domainScores[domain] += a.points_awarded;

    totalScore += a.points_awarded;
  });

  return { domainScores, totalScore };
};
