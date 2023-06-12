import React, { createContext, useState } from "react";

interface IInitialState {
  currentStep: string;
  currentProgress: number;
  setProgress: (progressStep: string, MyKad: IOCRNricData) => Promise<{ front: boolean; back: boolean }>;
  myKad: IOCRNricData;
}

interface GlobalProviderProps {
  // define props here
  children: React.ReactNode;
}

const mykad: IOCRNricData = {
  idNumber: "",
  name: "",
  dateOfBirth: "",
  address: "",
  placeOfBirth: "",
  postCode: "",
  city: "",
  state: "",
  gender: "",
  country: "Malaysia",
};
const initialState: IInitialState = {
  currentStep: "Front",
  currentProgress: 0.0,
  setProgress: () => Promise.resolve({ front: false, back: false }),
  myKad: { ...mykad },
};

export const GlobalContext = createContext<IInitialState>(initialState);

export const GlobalProvider = (props: React.PropsWithChildren<GlobalProviderProps>) => {
  const [state, setState] = useState(initialState);

  const setProgress = async (progressStep: string, myKad: IOCRNricData) => {
    let front: boolean = false;
    let back: boolean = false;
    if (progressStep === "Front") {
      setState({ ...state, currentStep: progressStep, myKad: myKad });
      console.log("Front card??", state.myKad);
      return { front: true, back: false };
    }

    if (progressStep === "Back") {
      setState({ ...state, currentStep: progressStep, myKad: myKad });
      console.log("Back card??", state.myKad);
      return { front: true, back: true };
    }
    console.log("current myKad info in context", state.myKad);
    console.log("front valid", front);
    console.log("back valid", back);
    return { front, back };
  };

  return (
    <GlobalContext.Provider
      value={{
        currentStep: state.currentStep,
        currentProgress: state.currentProgress,
        myKad: state.myKad,
        setProgress,
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
