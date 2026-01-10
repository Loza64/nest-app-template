import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('upload')
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    publicId: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    secureUrl?: string;

    @Column({ nullable: true })
    resourceType?: string;

    @Column({ nullable: true })
    format?: string;

    @Column({ nullable: true })
    originalFilename?: string;

    @Column('int', { nullable: true })
    width?: number;

    @Column('int', { nullable: true })
    height?: number;

    @Column('int', { nullable: true })
    bytes?: number;

    @Column('simple-array', { nullable: true })
    tags?: string[];

    @Column({ default: false })
    placeholder: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
