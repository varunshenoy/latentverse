# LatentVerse

LatentVerse uses latent consistency models (LCMs) and a custom LoRA ([360Redmond](https://civitai.com/models/118025/360redmond-a-360-view-panorama-lora-for-sd-xl-10)) to generate 360-degree equirectangular photos in seconds.

It's like Rick's portal gun, or Google Street View for your imagination.

![example animation](example.gif)

With the right set up, you can achieve near realtime generation. With an A100 and 4 steps, each inference takes ~1s. On an A10G (as shown in the video below), you get ~3s.

## Getting started

There are two parts of the project, the Next.js frontend app and the backend server hosted on Baseten.

You can deploy the frontend web app locally as follows:

1. Clone this repo.
2. `cd` into `webapp`
3. Run `npm install`

Unfortunately, you can't run the backend locally quite yet! We use Baseten, a serverless GPU provider for ML applications. The `deployment` folder has a Truss that can be deployed on Baseten.

1. Create an account on Baseten.
2. Run `pip install truss`
3. Run `truss push deployment --publish`. You may have to provide authentication credentials here.
4. Go to your app's dashboard on Baseten and grab the endpoint that has been set up.
5. Update the endpoint on line 10 in `webapp/src/app/api/portal/route.ts`.

The last step is creating a `.env.local` in `webapp` with the following Baseten credentials:

```
BASETEN_API_KEY=YOUR API KEY
BASETEN_ENDPOINT=YOUR API ENDPOINT (e.g. https://model-abcdef.api.baseten.co/production/predict)
```

You can now run `npm run dev` in `webapp`. By default, the web app should now be available at `https://localhost:3000`. Happy portal hopping!

![rick and morty](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjdhZ3p1MzZxYWE5YWVhYmhtbGl5MzJucm54Y3NzOXd6MWsyaW1mMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J27g804oxGiBHpzMJ4/giphy.gif)

## Contributions and Licensing

_LatentVerse was built by Varun Shenoy and David Song._

Feel free to provide any contributions you deem necessary or useful. This project is licensed under the MIT License.
