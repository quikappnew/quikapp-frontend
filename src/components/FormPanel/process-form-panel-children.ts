import { Children, ReactElement, ReactNode, cloneElement, isValidElement } from 'react';

const getFormInputElements = (children: ReactNode): ReactElement[] => {
  let formInputElements: ReactElement[] = [];

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      const element = child as ReactElement<any>; // Type assertion
      if (element.props.children) {
        // Recursively search for FormInput components inside divs or other components
        formInputElements = formInputElements.concat(getFormInputElements(element.props.children));
      } else {
        // FormInput components
        formInputElements.push(element);
      }
    }
  });

  return formInputElements;
};

const getReactElementClones = (children: ReactNode, readOnlyMode?: boolean): ReactElement[] => {
  let reactElementClones: ReactElement[] = [];

  Children.forEach(children, (child, index) => {
    if (isValidElement(child)) {
      const element = child as ReactElement<any>; // Type assertion

      reactElementClones.push(
        cloneElement(element, {
          key: `cloned-element-${index}`, // Assign a unique key
          readOnlyMode,
          children: getReactElementClones(element.props.children, readOnlyMode),
        })
      );
    } else {
      // This else block handles non-element children (like text)
      reactElementClones.push(child as unknown as ReactElement<any>);
    }
  });

  return reactElementClones;
};

export { getFormInputElements, getReactElementClones };
