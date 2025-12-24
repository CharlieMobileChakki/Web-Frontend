

export const setGetLocalData = (key, value) => {
  if (value !== undefined) {
    // Setter
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }

  // Getter
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const clearLocalData = () => {
  localStorage.clear();
};

