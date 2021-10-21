/**
 * Internal dependencies
 */
import Layout from './layout';
import { defaultColumnsNumber } from './edit';

export default function TiledGallerySave( { attributes, innerBlocks } ) {
	if ( ! innerBlocks.length ) {
		return null;
	}

	const {
		align,
		className,
		columns = defaultColumnsNumber( innerBlocks ),
		linkTo,
		roundedCorners,
		columnWidths,
		ids,
	} = attributes;

	return (
		<Layout
			align={ align }
			className={ className }
			columns={ columns }
			images={ innerBlocks.map( innerBlock => ( {
				...innerBlock.attributes,
				height: 100,
				width: 100,
			} ) ) }
			isSave
			layoutStyle={ 'square' }
			linkTo={ linkTo }
			roundedCorners={ roundedCorners }
			columnWidths={ columnWidths }
			ids={ ids }
		/>
	);
}
