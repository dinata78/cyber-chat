
const modalStack = [];

export function getTopModalFromStack() {
  return modalStack[modalStack.length - 1];
}

export function addModalToStack(modalName) {
  if (!modalStack.includes(modalName)) {
    modalStack.push(modalName);
  }
}

export function removeModalFromStack(modalName) {
  const isModalOnTop = getTopModalFromStack() === modalName;
  if (isModalOnTop) {
    modalStack.pop();
  }
}