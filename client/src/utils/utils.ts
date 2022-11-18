export const onLoadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
  });
};

export const randomStringFunc = (index: number): string => {
  const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
  let randomstring = "";

  for (var i = 0; i < index; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }

  return randomstring;
};
