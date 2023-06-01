<?php
/**
 * Base Step
 *
 * @package Automattic\Jetpack\CRM\Automation
 */

namespace Automattic\Jetpack\CRM\Automation;

/**
 * Base Step
 *
 * @inheritDoc
 */
abstract class Base_Step implements Step {

	/**
	 * @var string Slug name of the step.
	 */
	protected $slug;
	/**
	 * @var string Class name
	 */
	protected $class_name;
	/**
	 * @var string Step type.
	 */
	protected $type;
	/**
	 * @var string Step category.
	 */
	protected $category;
	/**
	 * @var string Step title.
	 */
	protected $title;
	/**
	 * @var string|null Step description.
	 */
	protected $description;
	/**
	 * @var array Step data.
	 */
	protected $attributes;
	/**
	 * @var array|null Next linked step.
	 */
	protected $next_step;

	/**
	 * Base_Step constructor.
	 *
	 * @param array $step_data The step data.
	 */
	public function __construct( array $step_data ) {
		$this->name        = $step_data['name'];
		$this->class_name  = $step_data['class_name'] ?? '';
		$this->title       = $step_data['title'] ?? '';
		$this->type        = $step_data['type'] ?? '';
		$this->category    = $step_data['category'] ?? '';
		$this->description = $step_data['description'] ?? '';
		$this->attributes  = $step_data['attributes'] ?? array();
	}

	/**
	 * Get the slug name of the step
	 *
	 * @return string
	 */
	public function get_slug(): string {
		return $this->name;
	}

	/**
	 * Get the title of the step
	 *
	 * @return string
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Get the description of the step
	 *
	 * @return string
	 */
	public function get_description(): ?string {
		return $this->description;
	}

	/**
	 * Get the type of the step
	 *
	 * @return string
	 */
	public function get_type(): string {
		return $this->type;
	}

	/**
	 * Get the category of the step
	 *
	 * @return string
	 */
	public function get_category(): string {
		return $this->category;
	}

	/**
	 * Get the data of the step
	 *
	 * @return array
	 */
	public function get_attributes(): array {
		return $this->attributes;
	}

	/**
	 * Set attributes of the step
	 * 
	 * @param array $attributes The attributes to set.
	 */
	public function set_attributes( array $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * Set the next step
	 *
	 * @param array $step_data The next linked step.
	 */
	public function set_next_step( array $step_data ) {
		$this->next_step = $step_data;
	}

	/**
	 * Get the next step
	 *
	 * @return array|null
	 */
	public function get_next_step(): ?array {
		return $this->next_step;
	}

	/**
	 * Execute the step
	 *
	 * @param array $data Data passed from the trigger.
	 */
	abstract public function execute( array $data );
}