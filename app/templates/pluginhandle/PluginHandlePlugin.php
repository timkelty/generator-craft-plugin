<?php
namespace Craft;
<% if ( useComposer ) { %>require 'vendor/autoload.php';<% } %>

class <%= pluginHandle %>Plugin extends BasePlugin
{
	function getName()
	{
		$pluginName	= Craft::t('<%= pluginName %>');
		$pluginNameOverride	= $this->getSettings()->pluginNameOverride;

		return ($pluginNameOverride) ? $pluginNameOverride : $pluginName;
	}

	function getVersion()
	{
		return '<%= pluginVersion %>';
	}

	function getDeveloper()
	{
		return '<%= developerName %>';
	}

	function getDeveloperUrl()
	{
		return '<%= developerUrl %>';
	}

	public function hasCpSection()
	{
		return true;
	}

	/**
	 * Define plugin settings
	 *
	 * @return array
	 */
	protected function defineSettings()
	{
		return array(
			'pluginNameOverride' => AttributeType::String,
		);
	}
}
