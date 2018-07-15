export class ServiceHelpers {
    
    get<T>(url: string, data?: any) : Promise<T> {

        return new Promise<T>((resolve, reject) => {

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        try {
                            var packet: T = JSON.parse(xmlHttp.responseText);
                            resolve(packet);
                        } catch (e) {
                            reject("Couldnt parse JSON response: "+e);
                        }
                    } else {
                        reject(xmlHttp.responseText);
                    }
                }
            }

            if (data)
                url += "?" + this.encode(data);

            xmlHttp.open("GET", url, true);
            xmlHttp.send();

        });

    }

    post(url: string, data: any): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            var token = this.getCookie("token");
            if (token == null)
                throw new Error("No token, cannot post!");

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.withCredentials = true;
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        resolve(true);
                    } else {
                        reject(xmlHttp.responseText);
                    }
                }
            }

            url += "?" + this.encode(data) + "&token="+token;

            xmlHttp.open("POST", url, true);
            xmlHttp.send();

        });

    }

    put(url: string, data: any): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            var token = this.getCookie("token");
            if (token == null)
                throw new Error("No token, cannot post!");

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.withCredentials = true;
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        resolve(true);
                    } else {
                        reject(xmlHttp.responseText);
                    }
                }
            }

            url += "?" + this.encode(data) + "&token="+token;

            xmlHttp.open("PUT", url, true);
            xmlHttp.send();

        });

    }


    private encode(obj:any) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    getCookie(name:string) : string | null {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            var popped = parts.pop();
            if (!popped)
                throw Error("Error getting cookie: "+value);

            var splitted = popped.split(";");
            if (!splitted)
                throw Error("Error getting cookie: "+value);

            var shifted = splitted.shift();
            if (!shifted)
                throw Error("Error getting cookie: "+value);

            return shifted;

        }

        return null;
    }

}