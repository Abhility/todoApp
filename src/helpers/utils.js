const changeStyles = (targetRef, targetEvent) => {
  targetRef.current.childNodes.forEach((child, index) => {
    if (index > 0) {
      child.classList.remove('teal');
      child.classList.remove('white-text');
      child.classList.remove('z-depth-3');
    }
  });
  if (targetEvent) {
    const { target: currentElement } = targetEvent;
    currentElement.classList.add('teal');
    currentElement.classList.add('white-text');
    currentElement.classList.add('z-depth-3');
  }
};

export default changeStyles;
