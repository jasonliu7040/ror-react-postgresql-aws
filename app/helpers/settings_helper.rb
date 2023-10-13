require 'reminders_service'

module SettingsHelper

  def reminder_templates_for_select
    @account.templates.reminders.map{ |template| [ "#{template.name} (#{TemplateChannel.label(template.channel)})" , template.id] }
  end

  def reminder_triggers_for_select
    TriggerType.labels
  end

  def themes_for_select
    [
        ["Black Tie", "black-tie"],
        ["Blitzer", "blitzer"],
        ["Cupertino", "cupertino"],
        ["Dark Hive", "dark-hive"],
        ["Dot Luv", "dot-luv"],
        ["Eggplant", "eggplant"],
        ["Excite Bike", "excite-bike"],
        ["Flick", "flick"],
        ["Hot Sneaks", "hot-sneaks"],
        ["Humanity", "humanity"],
        ["Le Frog", "le-frog"],
        ["Mint Choc", "mint-choco"],
        ["Overcast", "overcast"],
        ["Pepper Grinder", "pepper-grinder"],
        ["Redmond", "redmond"],
        ["Smoothness", "smoothness"],
        ["South Street", "south-street"],
        ["Start", "start"],
        ["Sunny", "sunny"],
        ["Swanky Purse", "swanky-purse"],
        ["Trontastic", "trontastic"],
        ["UI Darkness", "ui-darkness"],
        ["UI Lightness", "ui-lightness"],
        ["Vader", "vader"]
    ]
  end

  def regions_for_select
    [
        ["American", ""],
        ["Afrikaans", "af"],
        ["Albanian", "sq"],
        ["Algerian Arabic", "ar-DZ"],
        ["Arabic", "ar"],
        ["Armenian", "hy"],
        ["Azerbaijani", "az"],
        ["Bosnian", "bs"],
        ["Brazilian", "pt-BR"],
        ["Bulgarian", "bg"],
        ["Català", "ca"],
        ["Chinese", "zh-CN"],
        ["Chinese (Hong Kong)", "zh-HK"],
        ["Chinese (Taiwan)", "zh-TW"],
        ["Croatian", "hr"],
        ["Czech", "cs"],
        ["Danish", "da"],
        ["Dutch", "nl"],
        ["Dutch (Belgium)", "nl-BE"],
        ["German", "de"],
        ["English/Australia", "en-AU"],
        ["English/New Zealand", "en-NZ"],
        ["English/UK", "en-GB"],
        ["Español", "es"],
        ["Esperanto", "eo"],
        ["Estonian", "et"],
        ["Euskarako", "eu"],
        ["Faroese", "fo"],
        ["Finnish", "fi"],
        ["French", "fr"],
        ["Galician", "gl"],
        ["Georgian", "ka"],
        ["Greek", "el"],
        ["Hebrew", "he"],
        ["Hindi", "hi"],
        ["Hungarian", "hu"],
        ["Icelandic", "is"],
        ["Indonesian", "id"],
        ["Italian", "it"],
        ["Japanese", "ja"],
        ["Kazakh", "kk"],
        ["Khmer", "km"],
        ["Korean", "ko"],
        ["Latvian", "lv"],
        ["Lithuanian", "lt"],
        ["Luxembourgish", "lb"],
        ["Macedonian", "mk"],
        ["Malayalam", "ml"],
        ["Malaysian", "ms"],
        ["Norwegian", "no"],
        ["Polish", "pl"],
        ["Portuguese", "pt"],
        ["Persian (Farsi)", "fa"],
        ["Romansh", "rm"],
        ["Romanian", "ro"],
        ["Russian", "ru"],
        ["Slovak", "sk"],
        ["Slovenian", "sl"],
        ["Serbian", "sr"],
        ["Serbian (SR)", "sr-SR"],
        ["Swedish", "sv"],
        ["Swiss-French", "fr-CH"],
        ["Tajiki", "tj"],
        ["Tamil", "ta"],
        ["Thai", "th"],
        ["Turkish", "tr"],
        ["Ukrainian", "uk"],
        ["Vietnamese", "vi"],
        ["Welsh/UK", "cy-GB"],
    ]
  end

  def yes_no_for_select
    [['No', 'no'], ['Yes', 'yes']]
  end

  def yes_no_boolean_for_select
    [['No', 'false'], ['Yes', 'true']]
  end

end