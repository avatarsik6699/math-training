import React, { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [img, setImg] = useState<Blob>();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/conditions/1/1.jpg");
        const img = await response.blob();
        setImg(img);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <div>123</div>
    </div>
  );
}

export default App;
