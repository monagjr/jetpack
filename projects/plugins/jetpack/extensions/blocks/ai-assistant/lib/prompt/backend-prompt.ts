/**
 * Internal dependencies
 */
import {
	PROMPT_TYPE_SUMMARY_BY_TITLE,
	PROMPT_TYPE_CONTINUE,
	PROMPT_TYPE_SIMPLIFY,
	PROMPT_TYPE_CORRECT_SPELLING,
	PROMPT_TYPE_GENERATE_TITLE,
	PROMPT_TYPE_MAKE_LONGER,
	PROMPT_TYPE_MAKE_SHORTER,
	PROMPT_TYPE_CHANGE_TONE,
	PROMPT_TYPE_SUMMARIZE,
	PROMPT_TYPE_CHANGE_LANGUAGE,
	PROMPT_TYPE_USER_PROMPT,
	PromptTypeProp,
	PromptItemProps,
	BuildPromptProps,
} from './index';

/**
 * Constants
 */
const SUBJECT_TITLE = 'title';
const SUBJECT_CONTENT = 'content';
const SUBJECT_LAST_ANSWER = 'last-answer';

/**
 * Builds the initial message, that will be transformed on the
 * system prompt and relevent content message, if applicable.
 *
 * @param {PromptTypeProp} promptType - The internal type of the prompt.
 * @param {string} relevantContent - The relevant content, if available.
 * @param {string} customSystemPrompt - The custom system prompt, if available.
 * @returns {PromptItemProps} The initial message.
 */
export function buildInitialMessageForBackendPrompt(
	promptType: PromptTypeProp,
	relevantContent: string,
	customSystemPrompt: string
): PromptItemProps {
	// The basic temaplate for the message.
	return {
		role: 'jetpack-ai' as const,
		context: {
			type: 'ai-assistant-initial-prompt',
			for: mapInternalPromptTypeToBackendPromptType( promptType ),
			content: relevantContent?.length ? relevantContent : null,
			custom_system_prompt: customSystemPrompt?.length ? customSystemPrompt : null,
		},
	};
}

/**
 * Builds backend prompt message list
 * based on the type of prompt.
 *
 * @param {BuildPromptProps} options - The prompt options.
 * @returns {Array< PromptItemProps >} The prompt.
 */
export function buildMessagesForBackendPrompt( {
	generatedContent,
	allPostContent,
	postContentAbove,
	currentPostTitle,
	options,
	type,
	userPrompt,
	isGeneratingTitle,
}: BuildPromptProps ): Array< PromptItemProps > {
	return [
		{
			role: 'jetpack-ai',
			context: buildMessageContextForUserPrompt( {
				generatedContent,
				allPostContent,
				postContentAbove,
				currentPostTitle,
				options,
				type,
				userPrompt,
				isGeneratingTitle,
			} ),
		},
	];
}

/**
 * Gets the subject of the prompt.
 *
 * @param {boolean} isGeneratingTitle - Whether the action is to generate a title.
 * @param {boolean} isContentGenerated - Whether the current content was generated.
 * @returns {string} The subject.
 */
function getSubject( isGeneratingTitle: boolean, isContentGenerated: boolean ): string {
	if ( isGeneratingTitle ) {
		return SUBJECT_TITLE;
	}
	if ( isContentGenerated ) {
		return SUBJECT_CONTENT;
	}
	return SUBJECT_LAST_ANSWER;
}

/**
 * Builds backend message context based on the type
 * and the options of the prompt.
 *
 * @param {BuildPromptProps} options - The prompt options.
 * @returns {object} The context.
 */
function buildMessageContextForUserPrompt( {
	options,
	type,
	userPrompt,
	isGeneratingTitle,
}: BuildPromptProps ): object {
	const isContentGenerated = options?.contentType === 'generated';

	// Determine the subject of the action
	const subject = getSubject( isGeneratingTitle, isContentGenerated );

	/*
	 * Each type of prompt has a different context.
	 * The context is used to identify the prompt type in the backend,
	 * as well as provide relevant pieces for the prompt building.
	 */

	if ( type === PROMPT_TYPE_SUMMARY_BY_TITLE ) {
		return {
			type: 'ai-assistant-summary-by-title',
		};
	}

	if ( type === PROMPT_TYPE_CONTINUE ) {
		return {
			type: 'ai-assistant-continue',
		};
	}

	if ( type === PROMPT_TYPE_SIMPLIFY ) {
		return {
			type: 'ai-assistant-simplify',
			subject,
		};
	}

	if ( type === PROMPT_TYPE_CORRECT_SPELLING ) {
		return {
			type: 'ai-assistant-correct-spelling',
			subject,
		};
	}

	if ( type === PROMPT_TYPE_GENERATE_TITLE ) {
		return {
			type: 'ai-assistant-generate-title',
		};
	}

	if ( type === PROMPT_TYPE_MAKE_LONGER ) {
		return {
			type: 'ai-assistant-make-longer',
			subject,
		};
	}

	if ( type === PROMPT_TYPE_MAKE_SHORTER ) {
		return {
			type: 'ai-assistant-make-shorter',
			subject,
		};
	}

	if ( type === PROMPT_TYPE_CHANGE_TONE ) {
		return {
			type: 'ai-assistant-change-tone',
			tone: options?.tone,
			subject,
		};
	}

	if ( type === PROMPT_TYPE_SUMMARIZE ) {
		return {
			type: 'ai-assistant-summarize',
			subject,
		};
	}

	if ( type === PROMPT_TYPE_CHANGE_LANGUAGE ) {
		return {
			type: 'ai-assistant-change-language',
			language: options?.language,
			subject,
		};
	}

	// default to the user prompt
	return {
		type: 'ai-assistant-user-prompt',
		request: userPrompt,
	};
}

/**
 * Maps the internal prompt type to the backend prompt type.
 *
 * @param {PromptTypeProp} promptType - The internal type of the prompt.
 * @returns {string} The backend type of the prompt.
 */
function mapInternalPromptTypeToBackendPromptType( promptType: PromptTypeProp ): string {
	const map = {
		[ PROMPT_TYPE_SUMMARY_BY_TITLE ]: 'ai-assistant-summary-by-title',
		[ PROMPT_TYPE_CONTINUE ]: 'ai-assistant-continue-writing',
		[ PROMPT_TYPE_SIMPLIFY ]: 'ai-assistant-simplify',
		[ PROMPT_TYPE_CORRECT_SPELLING ]: 'ai-assistant-correct-spelling',
		[ PROMPT_TYPE_GENERATE_TITLE ]: 'ai-assistant-generate-title',
		[ PROMPT_TYPE_MAKE_LONGER ]: 'ai-assistant-make-longer',
		[ PROMPT_TYPE_MAKE_SHORTER ]: 'ai-assistant-make-shorter',
		[ PROMPT_TYPE_CHANGE_TONE ]: 'ai-assistant-change-tone',
		[ PROMPT_TYPE_SUMMARIZE ]: 'ai-assistant-summarize',
		[ PROMPT_TYPE_CHANGE_LANGUAGE ]: 'ai-assistant-change-language',
		[ PROMPT_TYPE_USER_PROMPT ]: 'ai-assistant-user-prompt',
	};

	return map[ promptType ];
}
