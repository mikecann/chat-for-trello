export class FileHelpers
{
    loadJson<T>(fileUrl: string): Promise<T>
    {
        return this.load(fileUrl)
            .then(jsonStr =>
            {
                return <T>JSON.parse(jsonStr);
            });
    }

    load(fileUrl: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () =>
            {
                if (xhr.readyState == 4)
                {
                    if (xhr.status == 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            xhr.open("GET", chrome.extension.getURL(fileUrl), true);
            xhr.send();
        });
    }
}

