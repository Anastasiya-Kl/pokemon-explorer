import Image from "next/image";

type PokemonSpriteProps = {
	src: string;
	alt: string;
	className?: string;
	imageClassName?: string;
};

export function PokemonSprite({
	src,
	alt,
	className,
	imageClassName,
}: PokemonSpriteProps) {
	return (
		<div className={className}>
			{src ? (
				<Image
					alt={alt}
					className={imageClassName}
					height={176}
					src={src}
					width={176}
				/>
			) : (
				<span className="text-center text-slate-400 text-xs">No image</span>
			)}
		</div>
	);
}
