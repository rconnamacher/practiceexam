
export const exam = {};

exam.title = num => `Prueba de muestra: ${num} preguntas`;
exam.grade_test_button = "Calificar la prueba";
exam.test_results = (num, max, percentage) => `${num} respuestas correctas de ${max} preguntas (${percentage}%)`;