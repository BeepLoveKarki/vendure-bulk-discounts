import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { ID, TransactionalConnection } from "@vendure/core";
import { DeletionResponse } from "@vendure/common/lib/generated-types";
import { BulkDiscount } from "./bulk-discount.entity";
import { BulkDiscountInput } from "./index";
export declare class BulkDiscountService {
    private connection;
    constructor(connection: TransactionalConnection);
    findAll(ctx: any, options: FindManyOptions<BulkDiscount> | undefined): Promise<BulkDiscount[]>;
    findByProductVariantSku(ctx: any, productVariantSku: string): Promise<BulkDiscount[]>;
    findByProductVariantId(ctx: any, productVariantId: ID): Promise<BulkDiscount[]>;
    findByProductId(ctx: any, productId: ID): Promise<BulkDiscount[]>;
    findProductVariantIdBySku(ctx: any, sku: string): Promise<ID>;
    findOne(ctx: any, recommendationId: ID): Promise<BulkDiscount | undefined>;
    create(ctx: any, input: BulkDiscountInput): Promise<BulkDiscount[]>;
    update(ctx: any, id: number, quantity: number, price: number): Promise<import("typeorm").UpdateResult>;
    delete(ctx: any, ids: any[]): Promise<DeletionResponse>;
}
