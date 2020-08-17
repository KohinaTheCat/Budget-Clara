export const addTransaction = (list) => {
  return (dispatch) => {
    dispatch({
      type: "TRANSACTION",
      list: list,
    });
  };
};
