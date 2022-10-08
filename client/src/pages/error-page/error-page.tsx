import React from "react";
import { useRouteError } from "react-router-dom";

interface IRouteError {
  statusText?: string;
  status?: number;
}

const isRouteError = (error: unknown): error is IRouteError => {
  return typeof error === "object" && error !== null && ("statusText" in error || "message" in error);
};

const ErrorPage = () => {
  const error = useRouteError();

  const { status, msg } = React.useMemo(() => {
    if (isRouteError(error)) {
      return {
        msg: error.statusText,
        status: error.status,
      };
    }

    return {
      msg: "",
      status: "",
    };
  }, [error]);

  console.log(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{status}</i>
        <br/>
        <i>{msg}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
