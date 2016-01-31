//=============================================================================
// Portraits.js
//=============================================================================

var Imported = Imported || {};
Imported.Portraits = true;
var Portraits = Portraits || {};

/*:
 * @plugindesc Display Battlers Portraits
 * @author Michael Dionne
 *
 * @help ....
 * @param Bars Horizontal Padding
 * @desc Use this to set horizontal alignment for HP and MP bars (for 4 rows, recommended value is -60; for 6 rows, 30; for 8 rows, 75):
 * @default -60
 *
 * @param Global Window Vertical Margin
 * @desc Use this to set vertical alignment for the whole window:
 * @default 13
 *
 * @param Actors Quantity
 * @desc Use this to change the quantity of actors to show in the BattleStatus window:
 * @default 4
 *
 * @param ATB Compatibility
 * @desc Set this to 1 to be compatible with Ellye's Simple ATB plugin (if set to 0, ATB will still work but it won't display the ATB bar in the BattleStatus window):
 * @default 0
 *
 * @param TP and ATB Enabled
 * @desc Set this to 1 if you have ATB Compatibility to 1 AND also want to display TP, to give an extra line for all bars to have enough space to show up (however, the BattleCommand window won't be aligned vertically with the BattleStatus window):
 * @default 0
 *
 */

(function() {


	Window_BattleStatus.prototype.initialize = function()
	{
		Portraits.Parameters = PluginManager.parameters('Portraits');
		Portraits.Param = Portraits.Param || {};
		Portraits.Param.globalwindowverticalmargin = Number(Portraits.Parameters['Global Window Vertical Margin'] || 13);
		Portraits.Param.barshorizontalpadding = Number(Portraits.Parameters['Bars Horizontal Padding'] || -60);
		Portraits.Param.actorsquantity = Number(Portraits.Parameters['Actors Quantity'] || 4);
		Portraits.Param.atbcompatibility = Number(Portraits.Parameters['ATB Compatibility'] || 0);
		Portraits.Param.atbandtp = Number(Portraits.Parameters['TP and ATB Enabled'] || 0);
	
		var width = this.windowWidth();
		var height = this.windowHeight();
		var lineHeight = this.lineHeight();
		var linesqt = 5;

		if (Portraits.Param.atbandtp == 1)
		{
			var linesqt = 6;
			
		}
		
		height = lineHeight*linesqt;
		var x = Graphics.boxWidth - width;
		var y = Graphics.boxHeight - height;
		var selectable = Window_Selectable.prototype.initialize.call(this, x, y + Portraits.Param.globalwindowverticalmargin, width, height);
		this.refresh();
		this.openness = 0;
    };


	Window_BattleStatus.prototype.drawItem = function(index)
	{
		var actor = $gameParty.battleMembers()[index];
		this.drawBasicArea(this.basicAreaRect(index), actor);
		this.drawGaugeArea(this.gaugeAreaRect(index), actor);
	};

	
	Window_BattleStatus.prototype.basicAreaRect = function(index)
	{
		var rect = this.itemRectForText(index);
		rect.width -= this.gaugeAreaWidth() + 15;
		return rect;
	};

	
	Window_BattleStatus.prototype.numVisibleRows = function()
	{
		return 1;
	};

	
	Window_BattleStatus.prototype.maxCols = function()
	{
		return Portraits.Param.actorsquantity;
	};

	
	Window_BattleStatus.prototype.gaugeAreaRect = function(index)
	{
		var rect = this.itemRectForText(index);
		rect.x += rect.width - this.gaugeAreaWidth() + Portraits.Param.barshorizontalpadding;
		rect.width = this.gaugeAreaWidth();
		return rect;
	};

	
	Window_BattleStatus.prototype.gaugeAreaWidth = function()
	{
		return 330;
	};
	

	Window_BattleStatus.prototype.drawBasicArea = function(rect, actor)
	{
		var lineHeight = this.lineHeight();
		this.drawActorFace(actor, rect.x+0, rect.y + lineHeight * 0, 110, 142);
		this.drawActorName(actor, rect.x, rect.y + lineHeight * 0, 150);
		this.drawActorIcons(actor, rect.x + 156, rect.y + lineHeight * 0, rect.width - 156);
		
	};

	
	Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor)
	{
		
		if ($dataSystem.optDisplayTp)
		{
			if (Portraits.Param.atbcompatibility == 0)
			{
				this.drawGaugeAreaWithTp(rect, actor);
			}
			
			else if (Portraits.Param.atbcompatibility == 1)
			{
				this.drawGaugeAreaWithTpWithATB(rect, actor);
			}
		}
		
		else
		{
		
			if (Portraits.Param.atbcompatibility == 0)
			{
				this.drawGaugeAreaWithoutTp(rect, actor);
			}
			
			else if (Portraits.Param.atbcompatibility == 1)
			{
				this.drawGaugeAreaWithoutTpWithATB(rect, actor);
			}
		
			
		}
		
	};

	
	Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor)
	{
		var lineHeight = this.lineHeight();
		this.drawActorHp(actor, rect.x+156, rect.y + lineHeight * 1, 88);
		this.drawActorMp(actor, rect.x+156, rect.y + lineHeight * 2, 88);
		this.drawActorTp(actor, rect.x+156, rect.y + lineHeight * 3, 88);
	};
	
	
			Window_BattleStatus.prototype.drawGaugeAreaWithTpWithATB = function(rect, actor)
			{
				var lineHeight = this.lineHeight();
				this.drawActorHp(actor, rect.x+156, rect.y + lineHeight * 1, 88);
				this.drawActorMp(actor, rect.x+156, rect.y + lineHeight * 2, 88);
				this.drawActorTp(actor, rect.x+156, rect.y + lineHeight * 3, 88);
				this.drawActorATB(actor, rect.x+156, rect.y + lineHeight * 4, 88);
			};

	
	Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor)
	{
		var lineHeight = this.lineHeight();
		this.drawActorHp(actor, rect.x + 156, rect.y + lineHeight * 2, 88);
		this.drawActorMp(actor, rect.x + 156, rect.y + lineHeight * 3, 88);
	};
	
			
			Window_BattleStatus.prototype.drawGaugeAreaWithoutTpWithATB = function(rect, actor)
			{
				var lineHeight = this.lineHeight();
				this.drawActorHp(actor, rect.x + 156, rect.y + lineHeight * 1, 88);
				this.drawActorMp(actor, rect.x + 156, rect.y + lineHeight * 2, 88);
				this.drawActorATB(actor, rect.x + 156, rect.y + lineHeight * 3, 88);
			};

	
	Window_Selectable.prototype.itemHeight = function()
	{
		console.log(this.maxCols);
		return this.lineHeight();
	};

	
})();










(function() {

	var _Window_Base_new = Window_Base.prototype.create;
	
	
    Window_Base.prototype.create = function()
	{
        _Window_Base_new.call(this);
		this.createDisplayObjects();
    };
	
	
	Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2)
	{
		var fillW = Math.floor(width * rate);
		var gaugeY = y + this.lineHeight() - 19;
		var lineHeight = this.lineHeight();
		this.contents.fillRect(x, gaugeY, width, 16, this.gaugeBackColor());
		this.contents.gradientFillRect(x, gaugeY, fillW, 16, color1, color2);
	};
	
	
	Window_Base.prototype.drawActorHp = function(actor, x, y, width)
	{
		width = width || 186;
		var color1 = '#ff9933';
		var color2 = '#ffcc66';
		this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
		this.drawText(TextManager.hpA, x, y, 44);
		this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
							   this.hpColor(actor), this.normalColor());
	};
	
	
	Window_Base.prototype.drawActorMp = function(actor, x, y, width)
	{
		width = width || 186;
		var color1 = '#3399ff';
		var color2 = '#66ccff';
		this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
		this.drawText(TextManager.mpA, x, y, 44);
		this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
							   this.mpColor(actor), this.normalColor());
	};
	
	
	Window_Base.prototype.drawActorATB = function(actor, x, y, width)
	{
		width = width || 186;
		var color1 = '#3399ff';
		var color2 = '#66ccff';
		this.drawGauge(x, y, width, actor.atbRate(), color1, color2);
		this.drawText("AT", x, y, 44);
	};
	
	
	Window_Base.prototype.drawActorTp = function(actor, x, y, width)
	{
		width = width || 96;
		var color1 = this.tpGaugeColor1();
		var color2 = this.tpGaugeColor2();
		this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
		this.drawText(TextManager.tpA, x, y, 44);
		this.changeTextColor(this.tpColor(actor));
		this.drawText(actor.tp, x + width - 64, y, 64, 'right');
	};
	
	
	
})();