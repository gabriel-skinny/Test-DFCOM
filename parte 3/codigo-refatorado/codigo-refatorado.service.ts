import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ClientSession } from "mongoose";
import { Product } from "./product.model";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

interface ICreateProductParams {
  title: string;
  description: string;
  price: string;
  category: string;
}

interface IUpdateProductParams {
  title: string;
  description: string;
  price: string;
  category: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>
  ) {}

  async createProduct({
    title,
    description,
    price,
    category,
  }: ICreateProductParams): Promise<{ productId: string }> {
    const newProduct = new this.productModel({
      title,
      description,
      price,
      category,
    });

    const result = await newProduct.save(newProduct);

    return { productId: result.id };
  }

  async getProducts(filters?: any): Promise<Product[]> {
    const { category, minPrice, maxPrice } = filters || {};
    const query = this.productModel.find();

    if (category) {
      query.where("category").equals(category);
    }

    if (minPrice !== undefined) {
      query.where("price").gte(minPrice);
    }

    if (maxPrice !== undefined) {
      query.where("price").lte(maxPrice);
    }

    const products = await query
      .select("title description price category")
      .exec();

    if (products.length === 0) {
      throw new NotFoundException("No products found with the given criteria");
    }

    return products;
  }

  async getProduct(productId: string): Promise<Product> {
    return this.findProduct(productId);
  }

  async updateProduct({
    productId,
    updateProductData,
  }: {
    productId: string;
    updateProductData: IUpdateProductParams;
  }): Promise<void> {
    const productToUpdateExists = await this.productModel.existsById(productId);

    if (!productToUpdateExists)
      throw new NotFoundException("Could not find product to update");

    await this.productModel.update({ updateProductData });
  }

  async deleteProduct(productId: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: productId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Could not find product.");
    }
  }

  private async findProduct(
    id: string,
    session?: ClientSession
  ): Promise<Product> {
    let product = await this.productModel.findById(id).session(session).exec();

    if (!product) {
      throw new NotFoundException("Could not find product.");
    }

    return product;
  }
}
