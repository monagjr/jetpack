import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getIconColor } from '../../../shared/block-icons';
import { RecipeStepIcon } from '../icon';
import edit from './edit';
import save from './save';

export const name = 'recipe-step';
export const title = __( 'Recipe Step', 'jetpack' );
export const settings = {
	title,
	description: (
		<Fragment>
			<p>{ __( 'A single recipe step.', 'jetpack' ) }</p>
		</Fragment>
	),
	keywords: [],
	icon: {
		src: RecipeStepIcon,
		foreground: getIconColor(),
	},
	category: 'embed',
	edit,
	save,
	parent: [ 'jetpack/recipe' ],
};
