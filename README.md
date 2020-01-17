# CE-Hub
 A markerplace to sell and consume electronic goods.

## Description
 This os a backend-service API for CE-Hub,where users can sign up and become a seller or consumer.
 
 Sellers can create virtual shops and add respective products to the shops.
 Consumers can skim through all the products via searching by shops,latest products,related products or by a simple search for specific product.
 Stripe payment gateway is also included so the selected product's details in the cart are sent to respective seller shops for further processing.

## Build-with
  1.NodeJs
  2.Mongodb
  3.express

## Getting started

 ### Prerequisites
  1.npm or yarn
  2.mongodb

 ### Steps to reproduce locally
  1.Clone this repository
    ```bash
     git clone 
    ```
  2.Run the following command to install all the neccessary modules
    ```bash
     npm install
    ```
    or
    ```bash
    yarn install
    ```
  3.Enter all necessary keys in sample.env file and rename it as .env file

  4.Then run the following command to bundle all files 
    ```bash
      npm run dev:build
    ```

  5.Finally run this command to start the server
   ```bash
    npm run dev
   ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
