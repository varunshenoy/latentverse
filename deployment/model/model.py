from diffusers import DiffusionPipeline, LCMScheduler
import torch
import base64
from PIL import Image
from io import BytesIO


class Model:
    def __init__(self, **kwargs):
        self.pipe = None

    def load(self):
        model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        lcm_lora_id = "latent-consistency/lcm-lora-sdxl"

        self.pipe = DiffusionPipeline.from_pretrained(model_id, variant="fp16")
        self.pipe.scheduler = LCMScheduler.from_config(self.pipe.scheduler.config)

        self.pipe.load_lora_weights(lcm_lora_id, adapter_name="lora")
        self.pipe.load_lora_weights(
            "artificialguybr/360Redmond",
            weight_name="View360.safetensors",
            adapter_name="view",
        )

        self.pipe.set_adapters(["lora", "view"], adapter_weights=[1.0, 1.2])

        targets = [
            self.pipe.vae,
            self.pipe.text_encoder,
            self.pipe.unet,
        ]
        for target in targets:
            for module in target.modules():
                if isinstance(module, torch.nn.Conv2d) or isinstance(
                    module, torch.nn.ConvTranspose2d
                ):
                    module.padding_mode = "circular"

        self.pipe.to(device="cuda", dtype=torch.float16)

        # self.pipe.unet = torch.compile(
        #     self.pipe.unet, mode="reduce-overhead", fullgraph=True
        # )
        # image = self.pipe(
        #     "golden retriever, 360, 360 view", num_inference_steps=4
        # ).images[0]

    def convert_to_b64(self, image: Image) -> str:
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_b64

    def predict(self, model_input):
        print(model_input)
        width = model_input.get("width", 1600)
        height = model_input.get("height", 800)
        num_inference_steps = model_input.get("num_inference_steps", 4)
        guidance_scale = model_input.get("guidance_scale", 0.5)

        # Run model inference here
        prompt = f"{model_input['prompt']}, 360, 360 view"
        negative_prompt = "unrealistic, blurry, low quality, undersaturated"

        image = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
        ).images[0]

        b64_results = self.convert_to_b64(image)

        return {"result": b64_results}
