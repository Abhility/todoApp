const sendRequest = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) throw Error();
    return await response.json();
  } catch (err) {
    window.M.toast({
      html:
        '<h6>Cannot connect to server!. Please check your internet connection</h6>',
      classes: 'red dark-3 white-text',
      displayLength: 2000,
    });
  }
};

export default sendRequest;
