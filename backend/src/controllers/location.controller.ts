import {
  Controller,
  Get,
  OperationId,
  Path,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";
import { LocationService } from "../services/location.service";
import { LocationResponseDTO } from "../dtos/location.dto";
import { ErrorResponse } from "../middlewares/error-handling.middleware";

@Route("locations")
@Tags("Location")
export class LocationController extends Controller {
  private locationService: LocationService;

  constructor() {
    super();
    this.locationService = new LocationService();
  }

  /**
   * Get location by id
   * @summary Get location by id
   * @param id Location ID
   * @returns LocationResponseDTO
   */
  @Get("{id}")
  @OperationId("getLocationById")
  @Security("jwt")
  @SuccessResponse(200, "Ok")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Response<ErrorResponse>(404, "Location not found")
  public async getLocationById(
      @Path() id: number // Changed to int
  ): Promise<LocationResponseDTO> {
    this.setStatus(200);
    const location = await this.locationService.getLocationById(id);
    return location;
  }
}

