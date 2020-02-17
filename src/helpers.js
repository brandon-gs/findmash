// Similiar to repeat in css
export const getGridTemplateColumns = (num, unit) => {
  let cad = "";
  for (let i = 0; i < num; i++) cad += `${unit} `;
  return cad;
};