<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package pixetty
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('loop-post-modern'); ?>>

    <?php pixetty_post_thumbnail(); ?>

    <div class="post-content">
        <div class="post-content-wrap">
            <header class="entry-header">
                <?php
                if (is_singular()) :
                    the_title('<h1 class="entry-title">', '</h1>');
                else :
                    the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                endif;

                if ('post' === get_post_type()) :
                    ?>
                    <div class="entry-meta">
                        <?php
                        pixetty_posted_on();

                        pixetty_posted_in();

                        ?>
                    </div><!-- .entry-meta -->
                <?php endif; ?>
            </header><!-- .entry-header -->

        </div>
        <a href="<?php the_permalink() ?>" class="button"><?php _e('Learn More', 'pixetty'); ?></a>

    </div>

</article><!-- #post-<?php the_ID(); ?> -->
