/**
 * The different payment blocks that can be chosen.
 */

import { name as donationsName, settings as donationSettings } from '../donations';
import { name as paymentButtonsName, settings as paymentButtonsSettings } from '../payment-buttons';
import premiumContentMetadata from '../premium-content/block.json';

const variations = [
	[ donationsName, donationSettings ],
	[ paymentButtonsName, paymentButtonsSettings ],
	[ premiumContentMetadata.name, premiumContentMetadata ],
];

const variationDefinitions = variations.map( ( [ blockName, settings ] ) => {
	return {
		name: blockName.includes( '/' ) ? blockName : 'jetpack/' + blockName,
		title: settings.title,
		description: settings.description,
		icon: settings.icon.src ?? settings.icon,
	};
} );

export default variationDefinitions;
