import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

// Default query for when no search term is provided.
const DEFAULT_QUERY = 'mountain';

// Pexels constants
const PEXELS_ID = 'pexels';
const PEXELS_NAME = 'Pexels Free Photos';
const PEXELS_SEARCH_PLACEHOLDER = `Search ${ PEXELS_NAME }`;

// Google Photos constants
const GOOGLE_PHOTOS_ID = 'google_photos';
const GOOGLE_PHOTOS_NAME = 'Google Photos';
const GOOGLE_PHOTOS_SEARCH_PLACEHOLDER = `Search ${ GOOGLE_PHOTOS_NAME }`;

/**
 * External media endpoints.
 */
// eslint-disable-next-line no-shadow
enum WpcomMedia {
	List = '/wpcom/v2/external-media/list/',
}

/**
 * External media sources.
 */
// eslint-disable-next-line no-shadow
enum MediaSource {
	Pexels = 'pexels',
	GooglePhotos = 'google_photos',
}

/**
 * Gutenberg media category search DTO.
 */
type MediaCategorySearch = {
	per_page: number;
	search: string;
};

/**
 * WPCOM media list item DTO.
 */
type WpcomMediaListItem = {
	ID: string;
	URL: string;
	caption: string;
	thumbnails: {
		thumbnail: string;
	};
};

/**
 * WPCOM media list response DTO.
 */
type WpcomMediaListResponse = {
	found: number;
	media: WpcomMediaListItem[];
};

/**
 * Gutenberg media category item DTO.
 */
type MediaCategoryItem = {
	sourceId: string;
	id: string;
	caption: string;
	previewUrl: string;
};

/**
 * Get media URL for a given MediaSource.
 *
 * @param {MediaSource} source - MediaSource to get URL for.
 * @param {MediaCategorySearch} mediaCategorySearch - MediaCategorySearch to filter for.
 * @returns {string} Media URL.
 */
const getMediaUrl = ( source: MediaSource, mediaCategorySearch: MediaCategorySearch ) =>
	addQueryArgs( `${ WpcomMedia.List }${ source }`, {
		number: mediaCategorySearch.per_page || 25,
		path: 'recent',
		search: mediaCategorySearch.search || DEFAULT_QUERY,
	} );

/**
 * Maps a WPCOM media list item to a Gutenberg media category item.
 *
 * @param {WpcomMediaListItem} item - WPCOM media list item to map.
 * @returns {MediaCategoryItem} Mapped media category item.
 */
const wpcomMediaItemToMediaCategory = ( item: WpcomMediaListItem ): MediaCategoryItem => ( {
	...item,
	sourceId: item.ID,
	id: item.ID,
	caption: item.caption,
	previewUrl: item.thumbnails.thumbnail,
} );

/**
 * Builds a Gutenberg media category object.
 *
 * @param {string} name - Name of the media category.
 * @param {string} label - Label of the media category.
 * @param {string} searchPlaceholder - Search placeholder of the media category.
 * @param {MediaSource} source - MediaSource of the media category.
 * @returns {object} Media category object.
 */
const buildMediaCategory = (
	name: string,
	label: string,
	searchPlaceholder: string,
	source: MediaSource
) => ( {
	name: name,
	labels: {
		name: label,
		search_items: searchPlaceholder,
	},
	mediaType: 'image',
	fetch: async ( mediaCategorySearch: MediaCategorySearch ) =>
		await apiFetch( {
			path: getMediaUrl( source, mediaCategorySearch ),
			method: 'GET',
		} )
			.then( ( response: WpcomMediaListResponse ) =>
				response.media.map( wpcomMediaItemToMediaCategory )
			)
			// Null object pattern, we don't want to break if the API fails.
			.catch( () => [] ),
	getReportUrl: null,
	isExternalResource: true,
} );

/**
 * Get Pexels media category.
 *
 * @returns {object} Pexels media category.
 */
export const getPexelsMediaCategory = () =>
	buildMediaCategory( PEXELS_ID, PEXELS_NAME, PEXELS_SEARCH_PLACEHOLDER, MediaSource.Pexels );

/**
 * Get Google Photos media category.
 *
 * @returns {object} Google Photos media category.
 */
export const getGooglePhotosMediaCategory = () =>
	buildMediaCategory(
		GOOGLE_PHOTOS_ID,
		GOOGLE_PHOTOS_NAME,
		GOOGLE_PHOTOS_SEARCH_PLACEHOLDER,
		MediaSource.GooglePhotos
	);
