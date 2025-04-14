export const getLanguages = (req, res) => {
    const languages = ['English', 'Igbo', 'Yoruba', 'Hausa'];
    res.status(200).json(languages);
  };
  