<? $this->widget('zii.widgets.CListView', array(
        'dataProvider'=>$dataProvider,
        'itemView'=>'_searchResult',   // refers to the partial view named '_post'
    ));

?>
<div class="clear"></div>