### You need to have anaconda installed to run this code.
https://www.anaconda.com/

### You can create a conda environment with the following command:
cd car-segmentation-ms
conda env create -f environment.yml
conda activate sam-microservice
uvicorn app.main:app --reload

### You can test the endpoint using Swagger UI:
Go to: http://127.0.0.1:8000/docs

