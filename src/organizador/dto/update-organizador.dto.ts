import { PartialType } from '@nestjs/swagger';
import { CreateOrganizadorDto } from './create-organizador.dto';

export class UpdateOrganizadorDto extends PartialType(CreateOrganizadorDto) {}
