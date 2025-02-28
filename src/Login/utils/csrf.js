// Utility function to get CSRF token from cookies
export const getCsrfToken = () => {
    const name = 'csrftoken';  // The cookie name in Django
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  };