import { addAsset } from "../controllers/assetController.js";
import Asset from "../models/Asset.js";

// Mock the Asset model
jest.mock("../models/Asset.js");

describe("addAsset Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { name: "Laptop", type: "Electronics", value: 50000 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should add a new asset successfully", async () => {
    const mockAsset = { ...req.body, _id: "mockId" };
    Asset.prototype.save = jest.fn().mockResolvedValue(mockAsset);

    await addAsset(req, res);

    expect(Asset.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAsset);
  });

  it("should return 400 if save fails", async () => {
    Asset.prototype.save = jest.fn().mockRejectedValue(new Error("DB Error"));

    await addAsset(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});
