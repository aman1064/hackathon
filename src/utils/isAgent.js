import Store from "../store/Store";
export default function parseJwt (token) {
    if(!token){
        token = Store.getState().commonData  && Store.getState().commonData.userDetails.accessToken;
    }
    if(!token){
        return false;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).isAgent;
}