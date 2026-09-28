// DAY 25
// Client Side API Error Handler

const getErrorMessage = (
  error,
  defaultMessage = "Something went wrong"
) => {
  if (!error) {
    return defaultMessage;
  }

  // Server response error
  if (error.response) {
    return (
      error.response.data?.message ||
      defaultMessage
    );
  }

  // Request was sent but no response received
  if (error.request) {
    return "Unable to connect to server";
  }

  // Other error
  return error.message || defaultMessage;
};

export default getErrorMessage;